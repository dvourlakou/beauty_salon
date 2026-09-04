import {useState,useEffect} from 'react';
import { Plus, Edit,  Trash2, Save, X} from 'lucide-react';
import {adminApi} from '../../api/adminApi.ts';
import type {Employee} from '../booking';
import toast from 'react-hot-toast';


const specializationLabels: Record<string, string> = {
    NAIL: 'Περιποίηση Νυχιών',
    WAXING: 'Αποτρίχωση',
    MASSAGE: 'Μασάζ'
};

export const AdminEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading,setLoading] = useState(true);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [showNewEmployee, setShowNewEmployee] = useState(false);
    const [newEmployee, setNewEmployee] = useState({name: '', specialization: ''});


    //Φόρτωση Αισθητικών
    
    const fetchEmployees = async () => {
        try {
            const data = await  adminApi.getAllEmployees();
            setEmployees(data);
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία φόρτωσης αισθητικών');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadEmployeeData = async () => {
            await fetchEmployees();
        };
        void loadEmployeeData();
    },[]);

    //Διαγραφή Αισθητικού

    const handleDelete = async (id: number) => {
        if (!confirm('Είστε σίγουρος/η;')) return;
        try {
            await adminApi.deleteEmployee(id);
            toast.success('Ο/Η αισθητικός διαγράφηκε');
            void fetchEmployees();
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία διαγραφής');
        }
    };

    //Ενημέρωση Αισθητικού

    const handleUpdate = async (employee: Employee) => {
        try {
            await adminApi.updateEmployee(employee.id, {
                name: employee.name,
                specialization: employee.specialization,
            });
            toast.success('Ο/Η αισθητικός ενημερώθηκε');
            setEditingEmployee(null);
            void fetchEmployees();
        }
        catch (error) {
            toast.error((error as Error).message ||'Αποτυχία ενημέρωσης');
        }
    };
    
    //Προσθήκη Αισθητικού

    const handleAdd = async () => {
        if (!newEmployee.name || !newEmployee.specialization) {
            toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
            return;
        }
        try {
            await adminApi.createEmployee(newEmployee);
            toast.success('Η αισθητικός προστέθηκε');
            setShowNewEmployee(false);
            setNewEmployee({name: '', specialization: ''});
            void fetchEmployees();
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
                <h1 className="text-2xl font-bold text-gray-800">Διαχείριση Αισθητικών</h1>
                <button
                    onClick={() => setShowNewEmployee(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400"
                >
                    <Plus size={18}/> Νέα Αισθητικός
                </button>

            </div>

            {showNewEmployee && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Προσθήκη Νέας Αισθητικού</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" placeholder="Όνομα" value={newEmployee.name}
                               onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                               className="border rounded-lg px-3 py-2"/>
                        <select value={newEmployee.specialization}
                                onChange={(e) => setNewEmployee({...newEmployee, specialization: e.target.value})}
                                className="border rounded-lg px-3 py-2">

                            <option value="">Επιλέξτε ειδικότητα</option>
                            <option value="NAIL">Περιποίηση Νυχιών</option>
                            <option value="WAXING">Αποτρίχωση</option>
                            <option value="MASSAGE">Μασάζ</option>

                        </select>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={handleAdd}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Προσθήκη
                        </button>
                        <button onClick={() => setShowNewEmployee(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Ακύρωση
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                        {editingEmployee?.id !== employee.id ? (
                            <>
                                <div>
                                    <span className="font-medium text-gray-700">{employee.name}</span>
                                    <span
                                        className="ml-3 text-sm text-gray-400">{specializationLabels[employee.specialization]}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingEmployee(employee)}
                                            className="text-gray-400 hover:text-blue-500"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(employee.id)}
                                            className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                </div>
                            </>
                        ) : (
                            <div className="flex  items-center gap-3 w-full">
                                <input type="text" value={editingEmployee.name}
                                       onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                                       className="flex-1 border rounded-lg px-3 py-1"
                                />
                                <select value={editingEmployee.specialization}
                                        onChange={(e) => setEditingEmployee({
                                            ...editingEmployee,
                                            specialization: e.target.value
                                        })}
                                        className="border rounded-lg px-3 py-2">

                                    <option value="NAIL">Περιποίηση Νυχιών</option>
                                    <option value="WAXING">Αποτρίχωση</option>
                                    <option value="MASSAGE">Μασάζ</option>
                                </select>
                                <button onClick={() => handleUpdate(editingEmployee)}
                                        className="text-green-500 hover:text-green-700"><Save size={18}/></button>
                                <button onClick={() => setEditingEmployee(null)}
                                        className="text-gray-400 hover:text-gray-500"><X size={18}/></button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
















