import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitMaintenanceRequest } from '../services/api';

const MaintenanceForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const serviceTypes = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliance Repair',
    'Painting',
    'Carpentry',
    'Pest Control',
    'General Maintenance',
    'Other'
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      await submitMaintenanceRequest(data);
      setSuccessMessage('Maintenance request submitted successfully! We will contact you soon.');
      reset();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1>Maintenance Request Portal</h1>
        <p>Submit your maintenance request below. No login required.</p>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="maintenance-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="unitNumber">Unit Number *</label>
            <input
              id="unitNumber"
              type="text"
              {...register('unitNumber', { required: 'Unit number is required' })}
              className={errors.unitNumber ? 'error' : ''}
              placeholder="e.g., 101, A-205"
            />
            {errors.unitNumber && <span className="error-text">{errors.unitNumber.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="serviceType">Service Type *</label>
            <select
              id="serviceType"
              {...register('serviceType', { required: 'Service type is required' })}
              className={errors.serviceType ? 'error' : ''}
            >
              <option value="">Select a service type</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.serviceType && <span className="error-text">{errors.serviceType.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary *</label>
            <input
              id="summary"
              type="text"
              {...register('summary', { required: 'Summary is required' })}
              className={errors.summary ? 'error' : ''}
              placeholder="Brief description of the issue"
            />
            {errors.summary && <span className="error-text">{errors.summary.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="details">Additional Details</label>
            <textarea
              id="details"
              {...register('details')}
              rows="4"
              placeholder="Provide any additional information about the maintenance request..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
