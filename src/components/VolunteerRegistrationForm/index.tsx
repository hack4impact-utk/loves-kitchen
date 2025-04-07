'use client';
import lktheme from '@/types/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const VolunteerRegistrationForm = () => {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      if (user && router) {
        // check if user exists in database
        const res = await fetch(`/api/volunteers/${user.sub}`, {
          method: 'GET',
        });
        const data = await res.json();

        // if so, redirect them
        if (data.volunteer != undefined) {
          router.push('/user');
        }
      }
    })();
  }, [user, router]);

  const getDisplayLabel = (rawName: string) => {
    let blah = '';
    let foundUpper = false;
    for (let i = 0; i < rawName.length; ++i) {
      if (rawName[i].toUpperCase() == rawName[i]) {
        blah = rawName.slice(0, i) + ' ' + rawName.slice(i);
        foundUpper = true;
      }
    }

    if (foundUpper) return blah.charAt(0).toUpperCase() + blah.slice(1);
    else return rawName.charAt(0).toUpperCase() + rawName.slice(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) return;

    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] =
          `${key[0].toLocaleUpperCase() + getDisplayLabel(key).toLocaleLowerCase().slice(1)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes

    // Submit form data to the backend
    try {
      const response = await fetch('/api/volunteers/volunteerRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authID: user.sub,
          is_staff: false,
          checked_in: false,
        }),
      });

      if (response.ok) {
        alert('Registration successful!');
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          address: '',
          phone: '',
          email: '',
        });
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div
      className="max-w-[400px] w-[87vw] text-white shadow-lg mt-[160px] lg:mt-[80px]"
      style={{
        padding: '20px',
        backgroundColor: lktheme.brown,
        borderRadius: '8px',
      }}
    >
      <p className="text-lg mb-4">Volunteer Registration</p>
      {['firstName', 'lastName', 'age', 'address', 'phone', 'email'].map(
        (field) => (
          <div key={field} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              {getDisplayLabel(field)}
            </label>
            <input
              type={
                field === 'age'
                  ? 'number'
                  : field === 'email'
                    ? 'email'
                    : 'text'
              }
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              style={{
                color: 'black',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
            {errors[field] && (
              <span style={{ color: '#ff4f4f' }}>{errors[field]}</span>
            )}
          </div>
        )
      )}
      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 20px',
          backgroundColor: lktheme.darkCyan,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default VolunteerRegistrationForm;
