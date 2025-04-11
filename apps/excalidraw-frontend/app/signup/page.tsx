import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUp = () => {
    return (
      <AuthLayout 
        title="Create your account" 
        description="Join DoodleSync and start collaborating"
      >
        <SignUpForm />
      </AuthLayout>
    );
  };
  
  export default SignUp;