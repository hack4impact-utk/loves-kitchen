import React, { useState } from 'react';

const VolunteerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = `${key} is required`;
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
        body: JSON.stringify(formData),
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2>Volunteer Registration</h2>
      {['firstName', 'lastName', 'age', 'address', 'phone', 'email'].map((field) => (
        <div key={field} style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'age' ? 'number' : field === 'email' ? 'email' : 'text'}
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
          {errors[field] && <span style={{ color: 'red' }}>{errors[field]}</span>}
        </div>
      ))}
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
};

export default VolunteerRegistrationForm;