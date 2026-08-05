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
                        <div key={service.id} className="felx items-center justify-between px-6 py-3 hover:bg-gray-50">
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
