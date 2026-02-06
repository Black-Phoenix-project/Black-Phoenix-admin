import { Tooltip } from "antd";
import { CiMoneyBill } from "react-icons/ci";
import { FaUser, FaVenusMars, FaPhone, FaBriefcase, FaClock, FaEdit, FaTrash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPassword } from "react-icons/tb";

const WorkerList = ({ workers, professions, editWorkerHandler, deleteWorkerHandler }) => {
    console.log("WORKERS: ", workers);
    console.log("professions: ", professions);

    const getWorkerSalary = (user) => {
        const workerSalary = professions.find(item => item.name === user.profession)
        return workerSalary ? workerSalary.salary : "N/A"
    }

    return (
        <div className="overflow-x-auto h-[65vh] text-xs w-full">
            {/* Sarlavhalar */}
            <div className="grid grid-cols-12 bg-primary text-base-content font-semibold p-3 rounded-t-lg">
                <div className="text-center w-[5%]">ID</div>
                <div className="flex items-center gap-3"><FaUser />First Name</div>
                <div className="flex items-center gap-3"><FaUser />Last Name</div>
                <div className="text-center">Age</div>
                <div className="flex items-center gap-3"><FaVenusMars />Gender</div>
                <div className="flex items-center gap-3"><FaPhone />Phone</div>
                <div className="flex items-center gap-3"><FaBriefcase />Profession</div>
                <div className="flex items-center gap-3"><CiMoneyBill />Salary</div>
                <div className="flex items-center gap-3"><FaClock />Work Time</div>
                <div className="flex items-center gap-3"><RiLockPasswordFill />Password</div>
                <div className="text-center">Status</div>
                <div className="text-center">Actions</div>
            </div>


            {workers.map((worker, index) => (
                <div key={worker.id} className="grid grid-cols-12 font-medium text-base-content p-3 border-b border-opacity-30 border-base-300 bg-opacity-30  text-left items-center">
                    <div className="text-center w-[5%]">{index + 1}</div>
                    <div>{worker.firstname}</div>
                    <div>{worker.lastname}</div>
                    <div className="text-center">{worker.age}</div>
                    <div>{worker.gender}</div>
                    <div>{worker.phone}</div>
                    <div className="flex flex-col text-left">
                        <span>{worker.profession}</span>
                        <span>Salary: {getWorkerSalary(worker)}UZS</span>

                    </div>
                    <div className="relative">
                        {getWorkerSalary(worker) || 0} <sup className="bg-success text-base-100 p-1 absolute -top-2 right-5 rounded-xl text-[7px]">UZS</sup>
                    </div>
                    <div>{worker.workTimeStart} - {worker.workTimeEnd}</div>
                    <div className="flex items-center justify-center cursor-pointer">
                        <div className="tooltip" data-tip="hello">
                            <button className="btn btn-primary">
                            </button>
                        </div>
                        <Tooltip placement="top" trigger={['hover']} overlay={<span>{worker.password || "Пароль еще не введен"}</span>}>
                            <TbPassword className="text-2xl" />
                        </Tooltip>
                    </div>
                    <div className="text-center">
                        <span className={`badge badge-xs font-normal text-base-100 ${worker?.status?.toLowerCase() === "active" ? "badge-success" : "badge-error"}`}>
                            {worker.status || "Active"}
                        </span>

                        {/* {
                            worker.status === "active" ? (
                                <div className="inline-grid *:[grid-area:1/1]">
                                    <div className="status status-error animate-ping"></div>
                                    <div className="status status-error"></div>
                                </div>
                            ) : (
                                <div className="inline-grid *:[grid-area:1/1]">
                                    <div className="status status-error animate-ping"></div>
                                    <div className="status status-error"></div>
                                </div>
                            )
                        } */}



                    </div>
                    <div className="flex gap-2 justify-center ">
                        <button className="btn btn-xs text-base-100 btn-warning btn-circle" onClick={() => editWorkerHandler(worker)}>
                            <FaEdit />
                        </button>
                        <button className="btn btn-xs text-base-100 btn-error btn-circle" onClick={() => deleteWorkerHandler(worker.id)}>
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkerList;