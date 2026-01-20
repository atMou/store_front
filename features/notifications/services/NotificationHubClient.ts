// SignalR Notification Hub Client
import { logger } from "@/shared/lib/logger";
import * as signalR from "@microsoft/signalr";
import {
  NewProductNotification,
  OrderStatusNotification,
  PaymentStatusNotification,
  ShipmentStatusNotification,
  StockAlertNotification,
} from "../types";

export class NotificationHubClient {
  private connection: signalR.HubConnection;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private getAccessToken: () => string;

  constructor(baseUrl: string, accessToken: string | (() => string)) {
    this.getAccessToken =
      typeof accessToken === "function" ? accessToken : () => accessToken;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/notifications`, {
        accessTokenFactory: () => this.getAccessToken(),
        // Prefer WebSockets, fallback to SSE (avoid slow LongPolling)
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents,
        skipNegotiation: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          if (retryContext.previousRetryCount === 3) return 30000;
          return 60000;
        },
      })
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? signalR.LogLevel.None
          : signalR.LogLevel.None
      )
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.connection.onreconnecting((error) => {
      logger.logConnection("signalr", "Reconnecting", {
        error: error?.message,
      });
      this.reconnectAttempts++;
    });

    this.connection.onreconnected((connectionId) => {
      logger.logConnection("signalr", "Reconnected", { connectionId });
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      if (this.reconnectAttempts >= this.maxReconnectAttempts && error) {
        logger.error("Max reconnection attempts reached", error);
      }
    });
  }

  async start(): Promise<void> {
    try {
      // Check if already connected or connecting
      if (
        this.connection.state === signalR.HubConnectionState.Connected ||
        this.connection.state === signalR.HubConnectionState.Connecting
      ) {
        logger.debug("Connection already active, skipping start");
        return;
      }

      await this.connection.start();
      logger.logConnection("signalr", "Connected to notification hub", {
        connectionId: this.connection.connectionId,
      });
    } catch (error) {
      const errorMessage = (error as Error)?.message || "Unknown error";

      // Only log specific errors, not negotiation failures when backend is offline
      if (
        !errorMessage.includes("connection was stopped during negotiation") &&
        !errorMessage.includes("Failed to start the connection")
      ) {
        logger.error("Failed to start SignalR connection", error as Error);
      } else {
        logger.debug("SignalR connection unavailable (backend offline)", {
          error: errorMessage,
        });
      }
      // Silently fail - app works in offline mode
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        await this.connection.stop();
      }
    } catch (err) {
      logger.debug("Error stopping connection", {
        error: (err as Error).message,
      });
    }
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }

  isConnected(): boolean {
    return this.connection.state === signalR.HubConnectionState.Connected;
  }

  private async ensureConnected(): Promise<void> {
    const currentState = this.connection.state;

    if (currentState === signalR.HubConnectionState.Connected) {
      return;
    }

    if (currentState === signalR.HubConnectionState.Connecting) {
      const timeout = 5000;
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const state = this.connection.state;
        if (state === signalR.HubConnectionState.Connected) {
          return;
        }
        if (state === signalR.HubConnectionState.Disconnected) {
          break;
        }
      }
      throw new Error("Connection timeout");
    }

    throw new Error(
      "SignalR connection is not available. Backend may be offline."
    );
  }

  // Event listeners
  onShipmentStatusUpdate(
    callback: (notification: ShipmentStatusNotification) => void
  ): void {
    this.connection.on("ReceiveShipmentStatusUpdate", callback);
  }

  onOrderStatusUpdate(
    callback: (notification: OrderStatusNotification) => void
  ): void {
    this.connection.on("ReceiveOrderStatusUpdate", callback);
  }

  onStockAlert(callback: (notification: StockAlertNotification) => void): void {
    this.connection.on("ReceiveStockAlert", callback);
  }

  onPaymentUpdate(
    callback: (notification: PaymentStatusNotification) => void
  ): void {
    this.connection.on("ReceivePaymentUpdate", callback);
  }

  onNotification(
    callback: (title: string, message: string, type: string) => void
  ): void {
    this.connection.on("ReceiveNotification", callback);
  }

  onNewProductNotification(
    callback: (notification: NewProductNotification) => void
  ): void {
    this.connection.on("ReceiveNewProductNotification", callback);
  }

  // Remove event listeners
  offShipmentStatusUpdate(): void {
    this.connection.off("ReceiveShipmentStatusUpdate");
  }

  offOrderStatusUpdate(): void {
    this.connection.off("ReceiveOrderStatusUpdate");
  }

  offStockAlert(): void {
    this.connection.off("ReceiveStockAlert");
  }

  offPaymentUpdate(): void {
    this.connection.off("ReceivePaymentUpdate");
  }

  offNotification(): void {
    this.connection.off("ReceiveNotification");
  }

  offNewProductNotification(): void {
    this.connection.off("ReceiveNewProductNotification");
  }

  // Hub method invocations
  async subscribeToOrder(orderId: string): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke("SubscribeToOrder", orderId);
  }

  async unsubscribeFromOrder(orderId: string): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke("UnsubscribeFromOrder", orderId);
  }

  async subscribeToShipment(shipmentId: string): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke("SubscribeToShipment", shipmentId);
  }

  async unsubscribeFromShipment(shipmentId: string): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke("UnsubscribeFromShipment", shipmentId);
  }

  async subscribeToProduct(
    productId: string,
    colorCode: string,
    sizeCode: string
  ): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke(
      "SubscribeToProduct",
      productId,
      colorCode,
      sizeCode
    );
  }

  async unsubscribeFromProduct(
    productId: string,
    colorCode: string,
    sizeCode: string
  ): Promise<void> {
    await this.ensureConnected();
    await this.connection.invoke(
      "UnsubscribeFromProduct",
      productId,
      colorCode,
      sizeCode
    );
  }
}
