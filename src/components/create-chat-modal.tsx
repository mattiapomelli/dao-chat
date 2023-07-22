import { useForm } from "react-hook-form";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { Modal } from "@components/basic/modal";
import { useCreateConversation } from "@lib/conversation/use-create-conversation";

import type { BaseModalProps } from "@components/basic/modal";

interface CreateChatModalProps extends BaseModalProps {
  onSuccess?: () => void;
}

export const CreateChatModal = ({
  open,
  onClose,
  onSuccess,
}: CreateChatModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ space: string }>();

  const { mutate: createConversation, isLoading } = useCreateConversation({
    onSuccess() {
      reset();
      onSuccess?.();
      onClose();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    createConversation({
      title: data.space,
    });
  });

  return (
    <Modal title="Create Chat" open={open} onClose={onClose}>
      <p className="mb-6">
        Create a group chat and manage everything for your DAO in a single
        place.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          label="Snapshot space name"
          block
          {...register("space", { required: "Space name is required" })}
          error={errors.space?.message}
        />
        <Button block type="submit" disabled={isLoading} loading={isLoading}>
          Create Chat
        </Button>
      </form>
    </Modal>
  );
};
