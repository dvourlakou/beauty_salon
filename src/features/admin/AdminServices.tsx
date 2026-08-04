import {useState} from 'react';
import {Plus, Edit, Trash2, Save, X} from 'lucide-react';
import {mockCategories} from '../services/mockData.ts';
import {Service, ServiceCategory} from '../services/types.ts';
import toast from 'react-hot-toast';

export const AdminServices = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>(mockCategories);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const[showNewService, setShowNewService] = useState(false);
    const [newService,setNewService] = useState({name: '', price: 0, categoryId: 0});
    const handleDelete = (id:number) => {
        if (!confirm('Είστε σίγουρος/η;')) return;
        setCategories(prev=> prev.map(cat=> ({
            ...cat,
            services: cat.services?.filter(s => s.id !== id)
        })));
        toast.success('Η υπηρεσία διαγράφηκε');
    };

    const handleUpdate = (service:Service)=> {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            services: cat.services?.map(s => s.id === service.id ? service: s)
        })));
        setEditingService(null);
        toast.success('Η υπηρεσία ενημερώθηκε');
    };

    const handleAdd = () => {
        if (!newService.name || newService.price <= 0 || newService.categoryId) {
            toast.error('Συμπληρώστε όλα τα πεδία');
            return;
        }
        const newId = Date.now();
        setCategories(prev => prev.map(cat => ({
            ...cat,
            services: cat.id === newService.categoryId? [...(cat.services || []), {...newService, id: newId, isActive: true,categoryId: newService.categoryId}] : cat.services
        })));
        setShowNewService(false);
        setNewService({ name: '', price: 0, categoryId: 0});
        toast.success('Η υπηρεσία προστέθηκε');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gary-800">Διαχείριση Υπηρεσιών</h1>
                <button
                    onClick={()=> setShowNewService(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400">
                    <Plus size={18}/>Νέα Υπηρεσία
                </button>
            </div>

            {showNewService && (
                <div className="bg-white rounded-xl shadow-sm border border-grey-100 p-4 mb-6">
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
                    </div>
            )}
        </div>

    )
}