import { useMutation, useQueryClient } from "@tanstack/react-query"

import api from "@/api"

export function useSetActiveTeam() {
	const queryClient = useQueryClient()

	const {
		data,
		isSuccess,
		mutate: setActiveTeam
	} = useMutation({
		mutationKey: ["set active team"],
		mutationFn: (id: string) => api.team.setActiveTeam(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["active team"] })
			queryClient.invalidateQueries({ queryKey: ["team"] })
			queryClient.invalidateQueries({ queryKey: ["teams"] })
			queryClient.invalidateQueries({ queryKey: ["team roles"] })
			queryClient.invalidateQueries({ queryKey: ["projects"] })
			queryClient.invalidateQueries({ queryKey: ["team invitations"] })
		}
	})

	return { data, isSuccess, setActiveTeam }
}
