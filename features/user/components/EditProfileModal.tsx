"use client";

import ImageUploader from "@/components/atoms/ImageUploader";
import NumberField from "@/features/auth/components/NumberField";
import TextAreaField from "@/features/auth/components/TextAreaField";
import TextField from "@/features/auth/components/TextField";
import { useAuth } from "@/hooks";
import useToast from "@/hooks/ui/useToast";
import { Label } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useUpdateUserMutation } from "../api";

// Schema matching the fields we want to edit + validation
const editProfileSchema = z.object({
  firstName: z.string().min(2, "First name is too short").optional(),
  lastName: z.string().min(2, "Last name is too short").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  age: z.number().min(13).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  city: z.string().min(2).optional(),
  street: z.string().min(2).optional(),
  postalCode: z.number().positive().optional(),
  houseNumber: z.number().positive().optional(),
  extraDetails: z.string().max(200).optional(),
  image: z.instanceof(File).optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const EditProfileModal = ({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}) => {
  const { user } = useAuth();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showToast } = useToast();

  const mainAddress = user?.addresses?.find((addr) => addr.isMain);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: undefined,
      gender: undefined,
      city: "",
      street: "",
      postalCode: undefined,
      houseNumber: undefined,
      extraDetails: "",
      image: undefined,
    },
  });

  // Update form values when user/address data is available
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "", // Note: API usually maps this to Phone
        age: user.age,
        gender: user.gender as "male" | "female" | "other" | undefined,
        city: mainAddress?.city || "",
        street: mainAddress?.street || "",
        postalCode: mainAddress?.postalCode,
        houseNumber: mainAddress?.houseNumber,
        extraDetails: mainAddress?.extraDetails || "",
      });
    }
  }, [user, mainAddress, form]);

  const onSubmit = async (data: EditProfileFormValues) => {
    if (!user) return;

    const formData = new FormData();
    // Basic Info
    if (data.firstName) formData.append("FirstName", data.firstName);
    if (data.lastName) formData.append("LastName", data.lastName);
    if (data.email) formData.append("Email", data.email);
    if (data.phone) formData.append("Phone", data.phone);
    if (data.age) formData.append("Age", data.age.toString());
    if (data.gender) formData.append("Gender", data.gender);
    if (data.image) formData.append("Image", data.image);

    // Address Info - Nested under 'Address'
    if (data.city) formData.append("Address.City", data.city);
    if (data.street) formData.append("Address.Street", data.street);
    if (data.postalCode)
      formData.append("Address.PostalCode", data.postalCode.toString());
    if (data.houseNumber)
      formData.append("Address.HouseNumber", data.houseNumber.toString());
    if (mainAddress?.id) formData.append("Address.Id", mainAddress.id); // Often needed for updates
    // Assuming backend needs isMain=true if we are updating the main address
    if (mainAddress) formData.append("Address.IsMain", "true");
    if (data.extraDetails)
      formData.append("Address.ExtraDetails", data.extraDetails);

    try {
      await updateUser({ id: user.id, data: formData }).unwrap();
      showToast({
        title: "Success",
        message: "Profile updated successfully",
        type:   "info",
      });
      onOpenChangeAction(false);
    } catch (error) {
      console.error("Update failed", error);
      showToast({
        title: "Error",
        message: "Failed to update profile",
        type: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="John"
                type="text"
              />
              <TextField
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                type="text"
              />
              <TextField
                control={form.control}
                name="email"
                label="Email"
                placeholder="john@example.com"
                type="email"
                
              />
              <TextField
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="+1234567890"
                type="text"
              />
              <div className="flex flex-col space-y-2">
                <NumberField
                  control={form.control}
                  name="age"
                  label="Age"
                  placeholder="25"

                />
              </div>
              <div className="flex flex-col space-y-3 pt-1">
                <Label>Gender</Label>
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Main Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                control={form.control}
                name="city"
                label="City"
                placeholder="New York"
                type="text"
              />
              <TextField
                control={form.control}
                name="street"
                label="Street"
                placeholder="Broadway"
                type="text" 
              />
              <NumberField
                control={form.control}
                name="postalCode"
                label="Postal Code"
                placeholder="10001"
              />
              <NumberField
                control={form.control}
                name="houseNumber"
                label="House Number"
                placeholder="123"
              />
              <div className="col-span-full">
                <TextAreaField
                  control={form.control}
                  name="extraDetails"
                  label="Extra Details"
                  placeholder="Apartment 4B..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-full">
              <ImageUploader
                control={form.control}
                setValue={form.setValue}
                errors={form.formState.errors}
                name="image"
                label="Profile Picture"
                multiple={false}
                maxFiles={1}
                variant="compact"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
