"use client";

import ImageUploader from "@/components/atoms/ImageUploader";
import { useAuth } from "@/hooks";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useForm } from "react-hook-form";
import { useUpdateUserMutation } from "../api";

export const AvatarUploadModal = ({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}) => {
  const { user } = useAuth();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ images: File; isMain: boolean[] }>({
    defaultValues: {
      images: undefined,
      isMain: [],
    },
  });

  const onSubmit = async (data: { images: File }) => {
    if (data.images && user) {
      const formData = new FormData();
      formData.append("Image", data.images);
      try {
        await updateUser({ id: user.id, data: formData }).unwrap();
        onOpenChangeAction(false);
      } catch (error) {
        console.error("Failed to upload avatar", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUploader
            control={control}
            errors={errors}
            setValue={setValue}
            label="Upload Image"
            name="images"
            maxFiles={1}
            multiple={false}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
