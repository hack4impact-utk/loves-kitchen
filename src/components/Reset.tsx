import React from 'react';
import { delVol, findVol } from '@/server/actions/actions';
import { IVolunteer } from '@/server/models/Volunteer';

interface ResetProps {
  setter: React.Dispatch<React.SetStateAction<IVolunteer[]>>;
}

const Reset = (props: ResetProps) => {
  return (
    <button
      onClick={() => {
        delVol();
        const refresh = async () => {
          props.setter([]);
          props.setter(await findVol());
        };
        refresh();
      }}
      className="bg-blue-700 hover:bg-blue-500 text-white p-2 w-[75px] rounded-lg"
    >
      Reset
    </button>
  );
};

export default Reset;
