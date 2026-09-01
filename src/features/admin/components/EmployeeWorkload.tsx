import type { EmployeeWorkload as WorkloadType } from '../types.ts';

interface EmployeeWorkloadProps {
    workload: WorkloadType[];
}

export const EmployeeWorkload = ({workload} : EmployeeWorkloadProps) => {

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4"> Ραντεβού Αισθητικών</h2>

            {workload.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Δε υπάρχουν διαθέσιμα στοιχεία</p>
            ) : (

            <div className="space-y-4">
                {workload.map((employee) => {
                    const percentage = Math.min((employee.total / employee.capacity)*100,100);
                    const isFull = percentage >=90;

                    return (
                        <div key={employee.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{employee.name}
                                </span>
                                <span className="text-gray-400">{employee.total} / {employee.capacity}
                                </span>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : 'bg-pink-300'}`} style={{width: `${percentage}%`}}/>

                            </div>
                        </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

