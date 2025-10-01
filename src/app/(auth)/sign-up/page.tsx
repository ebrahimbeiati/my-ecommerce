import AuthForm from "@/components/AuthForm";
import {signUp} from "@/lib/auth/actions";

export default function Page() {
  return <AuthForm type="signup" onSubmit={signUp} />;
}