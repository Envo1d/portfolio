import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "@/demo/error"
import { toast } from "sonner"

import { IDeleteTask } from "@/types/task.types"

import api from "@/api"
import { useCardModal } from "@/hooks/useCardModal"

export function useDeleteTask(projectId: string) {
	const queryClient = useQueryClient()

	const { mutate: deleteTask, isSuccess } = useMutation({
		mutationKey: ["delete task"],
		mutationFn: (data: IDeleteTask) => api.task.deleteTask(projectId, data),
		onSuccess() {
			useCardModal.getState().onClose()
			toast.success("Card deleted")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { deleteTask, isSuccess }
}
