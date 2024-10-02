import type {FormSubmitEvent} from '#ui/types'
import {z} from "zod";
import SignupSchema from "~/schemas/SignUp.schema";

export const useSignUp = () => {
    const formState = ref({
        name: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
    });

    const validationSchema = SignupSchema;
    const isLoading = ref(false);
    const router = useRouter();

    const handleSubmit = async (
        event: FormSubmitEvent<z.output<typeof SignupSchema>>
    ) => {
        try {
            isLoading.value = true;
            await useFetch("/api/auth/sign-up", {
                method: "POST",
                body: event.data,
            });
            useToast().add({
                title: "Account created",
                description: "Your account has been created successfully, Redirecting you to the sign in page",
            });
            await router.push({
                name: "auth-sign-in",
            });
        } catch (error) {
            console.log({error});
        } finally {
            isLoading.value = false;
        }
    };

    return {
        formState,
        isLoading,
        validationSchema,
        handleSubmit,
    };
};