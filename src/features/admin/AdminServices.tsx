import {useState,useEffect} from 'react';
import {Plus, Edit, Trash2, Save, X} from 'lucide-react';
import {adminApi} from '../../api/adminApi.ts';
import type {Service, ServiceCategory} from '../services';
import toast from 'react-hot-toast';

export const AdminServices = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading,setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const[showNewService, setShowNewService] = useState(false);
    const [newService,setNewService] = useState({name: '', price: 0, durationMinutes: 30, categoryId: 0});

    //Φόρτωση Υπηρεσιών
    
    const fetchServices = async () => {
        try {
            const data = await  adminApi.getAllServices();
            setCategories(data);
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία φόρτωσης υπηρεσιών');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadServices = async () => {
            await fetchServices();
        };
        void loadServices();
    },[]);

    //Διαγραφή Υπηρεσιών

    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουρος/η;')) return;
        try {
            await adminApi.deleteService(id);
            toast.success('Η υπηρεσία διαγράφηκε');
            void fetchServices();
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία διαγραφής');
        }
    };

    //Ενημέρωση Υπηρεσίας

    const handleUpdate = async (service: Service) => {
        try {
            await adminApi.updateService(service.id, {
                name: service.name,
                price: service.price,
                durationMinutes: service.durationMinutes,
                description: service.description,
                isActive: service.isActive
            });
            toast.success('Η υπηρεσία ενημερώθηκε');
            void fetchServices();
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία ενημέρωσης');
        }
    };

    //Προσθήκη Υπηρεσίας

    const handleAdd = async () => {
        if (!newService.name || newService.price <= 0 || !newService.categoryId) {
            toast.error('Συμπληρώστε όλα τα πεδία');
            return;
        }
        try {
            await adminApi.createService(newService);
            toast.success('Η υπηρεσία προστέθηκε');
            setShowNewService(false);
            setNewService({name: '', price: 0, categoryId: 0,durationMinutes: 0});
            void fetchServices();
        } catch (error) {
            toast.error((error as Error).message ||'Αποτυχία προσθήκης');
        }
    };

   //Render

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-300" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Διαχείριση Υπηρεσιών</h1>
                <button
                    onClick={()=> setShowNewService(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400">
                    <Plus size={18}/>Νέα Υπηρεσία
                </button>
            </div>

            {showNewService && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Προσθήκη Νέας Υπηρεσίας</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                            value={newService.categoryId}
                            onChange={(e) => setNewService({...newService, categoryId: parseInt(e.target.value)})}
                            className="border rounded-lg px-3 py-2">

                            <option value={0}>Επιλέξτε κατηγορία</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Όνομα"
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name:e.target.value})}
                            className="border rounded-lg px-3 py-2"
                            />
                        <input
                            type="number"
                            placeholder="Τιμή (€)"
                            value={newService.price || ''}
                            onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                            className="border rounded-lg px-3 py-2"
                            />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Προσθήκη</button>
                        <button onClick={() => setShowNewService(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Ακύρωση</button>

                    </div>
                </div>
            ) }

            {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-700">{category.name}</h2>
                    </div>
                    <div className="divide-y divide-gray-50">{category.services?.map((service) => (
                        <div key={service.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                            {editingService?.id !== service.id ? (
                                <>
                                <div>
                                   <span className="font-medium text-gray-700">{service.name}</span>
                                   <span className="ml-3 text-sm text-pink-400 font-semibold">{service.price}€</span>
                                </div>

                                <div className="flex gap-2">
                                  <button onClick={() => setEditingService(service)} className="text-gray-400 hover:text-blue-500"><Edit size={18} /> </button>
                                    <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /> </button>
                                </div>
                                </>

                            ) : (
                                <div className="flex items-center gap-3 w-full">
                                    <input type="text" value={editingService.name} onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                                           className="flex-1 border rounded-lg px-3 py-1"/>
                                    <input type="number" value={editingService.price} onChange={(e) => setEditingService({...editingService, price: parseFloat(e.target.value) })}
                                           className="w-24 border rounded-lg px-3 py-1"/>
                                    <button onClick={() => handleUpdate(editingService)}
                                            className="text-green-500 hover:text-green-700"><Save size={18} /> </button>
                                    <button onClick={() => setEditingService(null)}
                                            className="text-gray-400 hover:text-gray-600"><X size={18} /> </button>
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
            ))}
        </div>

    );
};
