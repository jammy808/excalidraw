import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SginInForm";

const SignIn = () => {
    return (
      <AuthLayout
        title="Welcome back" 
        description="Sign in to your account to continue drawing"
      >
        <SignInForm />
      </AuthLayout>
    );
  };
  
  export default SignIn;