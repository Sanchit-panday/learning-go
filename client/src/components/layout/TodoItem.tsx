
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import type { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/App";

const TodoItem = ({ todo }: { todo: Todo }) => {
    const queryClient = useQueryClient();
    const { mutate: updateTodo, isPending: isUpdating } = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async () => {
            if (todo.completed) return alert("Todo is already completed")
            try {
                const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
                    method: "PATCH",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data
            } catch (err) {
                console.log(err)
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    });
    const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTodo"],
        mutationFn: async () => {
            try {
                const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                console.log(error);
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    });
    return (
        <div className="space-x-3 sm:items-center flex flex-col sm:flex-row">
            <div className="flex flex-row flex-1 items-center border-1 rounded-2xl border-gray-600 p-2 space-x-3 justify-between" >
                <div className={`font-semibold break-all text-2xl sm:text-xl ${todo.completed ? "text-green-900 line-through" : "text-yellow-700"}`}>
                    {todo.body}
                </div>
                {todo.completed && (
                    <Badge className="rounded-full bg-emerald-500" variant="outline">
                        Done
                    </Badge>
                )}
                {!todo.completed && (
                    <Badge className="rounded-full bg-amber-300" variant="outline">
                        In Progress
                    </Badge>
                )}
            </div>
            <div className="gap-x-4 sm:gap-x-2 flex flex-row justify-center mt-2 sm:mt-0">
                <div className="cursor-pointer" onClick={() => updateTodo()}>
                    {!isUpdating && <CircleCheck color="green" strokeWidth={3} size={27} />}
                    {isUpdating && <LoaderCircle className="animate-spin" size={27}/>}
                </div>
                <div className="cursor-pointer" onClick={() => deleteTodo()}>
                    {!isDeleting && <CircleX color="red" strokeWidth={3}  size={27}/>}
                    {isDeleting && <LoaderCircle className="animate-spin" size={27}/>}
                </div>
            </div>
        </div>
    );
};
export default TodoItem;