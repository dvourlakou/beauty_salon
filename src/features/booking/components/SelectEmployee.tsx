import type {Employee} from '../types';

interface SelectEmployeeProps {
    employees: Employee[];
    selectedEmployee: number |null;
    onSelectEmployee: (id: number |null) => void;
}

export const SelectEmployee = ({
    employees,
    selectedEmployee,
    onSelectEmployee,
}: SelectEmployeeProps) => {
    if (employees.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {/* Οποιαδήποτε επιλογή */}
                <button
                    onClick={() => onSelectEmployee(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedEmployee === null ? 'bg-pink-300 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                    Οποιαδήποτε
                </button>

                {/* employee buttons */}
                {employees.map((employee) => (
                    <button
                    key={employee.id}
                    onClick={() => onSelectEmployee(employee.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedEmployee === employee.id ? 'bg-pink-300 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                        {employee.name}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-400">
                * Η επιλογή αισθητικού δεν είναι υποχρεωτική
            </p>
        </div>
    );
};

