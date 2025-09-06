import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UpdatePromo = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    const axiosSecure = useAxiosSecure();

    const [formData, setFormData] = useState({
        description: '',
        type: 'percentage',
        discount_value: 0,
        min_total_seats: 0,
        per_user_limit: 0,
        global_max_uses: 0,
        start_at: '',
        expires_at: '',
        combinable: 0,
        active: 1,
    });

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const res = await axiosSecure.get(`/promo-codes?code=${code}`);
                if (res.data) {
                    setFormData({
                        description: res.data.description || '',
                        type: res.data.type || 'percentage',
                        discount_value: res.data.discount_value || 0,
                        min_total_seats: res.data.min_total_seats || 0,
                        per_user_limit: res.data.per_user_limit || 0,
                        global_max_uses: res.data.global_max_uses || 0,
                        start_at: res.data.start_at?.slice(0, 16) || '',
                        expires_at: res.data.expires_at?.slice(0, 16) || '',
                        combinable: res.data.combinable ? 1 : 0,
                        active: res.data.active ? 1 : 0,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchPromo();
    }, [code, axiosSecure]);

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
            text: 'Do you want to update this promo code?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const payload = {
                        ...formData,
                        discount_value: Number(formData.discount_value),
                        min_total_seats: Number(formData.min_total_seats),
                        per_user_limit: Number(formData.per_user_limit),
                        global_max_uses: Number(formData.global_max_uses),
                        combinable: Number(formData.combinable),
                        active: Number(formData.active),
                    };
                    
                    await axiosSecure.patch(`/promo-codes?code=${code}`, payload);

                    Swal.fire('Updated!', 'Promo code updated successfully.', 'success');
                    navigate('/dashboard/manage-promo');
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error!', 'Failed to update promo code.', 'error');
                }
            }
        });
    };


    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
            <h2 className="text-4xl font-bold mb-6">Update Promo Code: {code}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

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
                    <div>
                        <label className="block font-medium mb-2">Per User Limit</label>
                        <input
                            type="number"
                            name="per_user_limit"
                            value={formData.per_user_limit}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Global Max Uses</label>
                        <input
                            type="number"
                            name="global_max_uses"
                            value={formData.global_max_uses}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Start At</label>
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
                            name="combinable"
                            checked={formData.combinable === 1}
                            onChange={handleChange}
                        />
                        Combinable
                    </label>
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
                    className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span className="relative">Update Promo</span>
                </button>

            </form>
        </div>
    );
};

export default UpdatePromo;
