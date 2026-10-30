import { useQuery } from "@tanstack/react-query"

import api from "@/api"

export function useTask(taskId: string) {
	const {
		data: task,
		isLoading,
		isError
	} = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => api.task.getById(taskId),
		enabled: Boolean(taskId)
	})

	return { task, isLoading, isError }
}
