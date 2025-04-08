import VolunteerRegistrationForm from '@/components/VolunteerRegistrationForm/';
import lktheme from '@/types/colors';
import NavBar from '@/components/NavBar';

export default function RegisterPage() {
  return (
    <>
      <NavBar />
      <div
        className="flex flex-col justify-center items-center min-h-screen w-screen pb-[100px] xl:pb-0"
        style={{
          backgroundColor: lktheme.offWhite,
        }}
      >
        <VolunteerRegistrationForm />
      </div>
    </>
  );
}
