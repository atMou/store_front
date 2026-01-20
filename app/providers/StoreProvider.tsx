"use client";

import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, store } from "../../store/store";
import AuthProvider from "./AuthProvider";

function StoreProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={Persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default StoreProvider;

// function CategoryRedirect({ children }: PropsWithChildren) {
//   const mainCategory = useAppSelector(selectMainCategory);
//   const router = useRouter();

//   useEffect(() => {
//     if (mainCategory) {
//       router.replace(`/${mainCategory.toLowerCase()}-home`);
//     }else {
//     router.replace(`/women-home`);
//     }
//   }, [mainCategory, router]);

//   return <>{children}</>;
// }
