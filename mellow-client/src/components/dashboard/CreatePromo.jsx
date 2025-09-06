import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CreatePromo = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        type: 'percentage',
        discount_value: 0,
        min_total_seats: 0,
        start_at: '',
        expires_at: '',
        active: 1,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to create this promo?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, create it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formatDateTime = (dt) => {
                        if (!dt) return null;
                        return dt.replace("T", " ") + ":00";
                    };

                    const payload = {
                        ...formData,
                        discount_value: Number(formData.discount_value),
                        min_total_seats: Number(formData.min_total_seats),
                        active: Number(formData.active),
                        start_at: formatDateTime(formData.start_at),
                        expires_at: formatDateTime(formData.expires_at),
                    };

                    await axiosSecure.post(`/promo-codes`, payload);

                    Swal.fire('Created!', 'Promo created successfully.', 'success');
                    navigate('/dashboard/manage-promo');
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error!', 'Failed to create promo.', 'error');
                }
            }
        });
    };


    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
            <h2 className="text-4xl font-bold mb-6">Create New Promo Code</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-medium mb-2">Promo Code</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        placeholder="e.g. SUMMER25"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Discount Value</label>
                        <input
                            type="number"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Min Total Seats</label>
                        <input
                            type="number"
                            name="min_total_seats"
                            value={formData.min_total_seats}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Starts At</label>
                        <input
                            type="datetime-local"
                            name="start_at"
                            value={formData.start_at}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Expires At</label>
                        <input
                            type="datetime-local"
                            name="expires_at"
                            value={formData.expires_at}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active === 1}
                            onChange={handleChange}
                        />
                        Active
                    </label>
                </div>

                <button
                    type="submit"
                    className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-green-500 text-white hover:text-green-500 rounded-lg group border-green-500 border-[0.1rem] min-w-max"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span className="relative">Create Promo</span>
                </button>

            </form>
        </div>
    );
};

export default CreatePromo;
