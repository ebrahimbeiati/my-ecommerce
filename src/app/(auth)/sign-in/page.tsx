import AuthForm from "@/components/AuthForm";
import {signIn} from "@/lib/auth/actions";

export default function Page() {
  return <AuthForm type="signin" onSubmit={signIn} />;
}