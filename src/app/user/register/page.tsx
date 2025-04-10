import VolunteerRegistrationForm from '@/components/VolunteerRegistrationForm/';
import lktheme from '@/types/colors';
import NavBar from '@/components/NavBar';

export default function RegisterPage() {
  return (
    <>
      <NavBar />
      <div
        className="flex flex-col justify-center items-center min-h-full w-full pb-[100px]"
        style={{
          backgroundColor: lktheme.offWhite,
        }}
      >
        <VolunteerRegistrationForm />
      </div>
    </>
  );
}
