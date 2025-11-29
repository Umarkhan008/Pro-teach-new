import { useEffect, useState } from "react"
import { onValueData, setData } from "../../../FirebaseData"
import { FaAngleRight, FaArrowLeft } from "react-icons/fa6"
import { Button } from "../../../components/ui/button"
import { ChengeNotify } from "../../../components/ui/Toast"

const permissionsList = [
    { key: "addGroup", label: "Yangi guruh qo'shish" },
    { key: "addUsers", label: "Yangi foydalanuvchilar qo'shish" },
    { key: "attend", label: "Davomat qilish" },
    { key: "changeCompanyInfo", label: "Kompaniya ma'lumotlarini o'zgartirish" },
    { key: "changeUserInfo", label: "Foydalanuvchilarni ma'lumotlarini o'zgartirish" },
    { key: "delateUsers", label: "Foydalanuvchilarni o'chirish" },
]

const Permissions = () => {
    const [Users, setUsers] = useState([])
    const [selectedUser, setselectedUser] = useState([])
    const [permission, setpermission] = useState({})
    const [SelectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        onValueData("Users", (data) => {
            const usersArray = Object.keys(data || {}).map(key => ({ key, ...data[key] }));
            setUsers(usersArray)
        })
    }, [])

    const handleUserClick = (userKey) => {
        setSelectedUser(userKey)
        const user = Users.find(u => u.key === userKey)
        setselectedUser(user)
        setpermission(user.permissions)
    }

    const hanldeSavePermissions = () => {
        setData(`Users/${SelectedUser}/permissions`, permission)
            .then(() => {
                ChengeNotify({ChengeTitle: "Ruxsatlar muvaffaqiyatli saqlandi."})
            })
            .catch((error) => {
                console.error("Xatolik yuz berdi: " + error.message)
            })
    }


    return (
        <>
            <h1 className="text-3xl font-semibold transition-all">
                Foydalanuvchi Ruxsatlari
            </h1>
            {
                !SelectedUser ? (
                    <div className="grid grid-cols-3 gap-5">
                        {
                            Users
                                .sort((a, b) => a.id - b.id)
                                .map((user) => {
                                    const permission = Object.values(user.permissions).filter(p => p === true).length
                                    return (
                                        <div
                                            className="flex flex-col gap-1 p-6 bg-gradient-to-br from-white to-gray-100 hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-gray-300 rounded-lg relative"
                                            onClick={() => handleUserClick(user.key)}
                                        >
                                            <div className="flex flex-col gap-1 border-b border-gray-200 pb-2 mb-2">
                                                <h3 className="text-xl font-semibold">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {user.email ? user.email : ""}
                                                </p>
                                                <span className="bg-gray-200 text-black font-medium px-3 py-[2px] flex justify-start capitalize rounded-2xl text-[13px] w-fit mt-1">
                                                    {user.role}
                                                </span>
                                                <FaAngleRight className="text-gray-600 self-end top-8 absolute" size={15} />
                                            </div>

                                            {/* Ruxsatlar bo'limi */}
                                            <div className="flex flex-col">
                                                <h4 className="text-xl font-medium">
                                                    {permission}
                                                    <small className="text-gray-500 font-normal">
                                                        {" / " + Object.values(user.permissions).length} ruhsat
                                                    </small>
                                                </h4>
                                                <div className="w-full bg-muted rounded-full h-2 mt-3 bg-gray-200">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${(permission / 6) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })

                        }
                    </div>
                ) : (
                    <div>
                        <Button
                            className="border border-solid border-gray-200 rounded-lg px-3 py-1 flex justify-center items-center gap-2 hover:bg-gray-100 hover:border-gray-300 transition-all"
                            onClick={() => setSelectedUser(null)}
                        >
                            <FaArrowLeft />
                            Orqaga
                        </Button>

                        <div
                            className="flex flex-col gap-6 mt-6 p-6 bg-gradient-to-br from-white to-gray-100 transition-all border-2 border-gray-200 rounded-lg"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="flex justify-center items-center w-12 h-12 text-white font-bold text-2xl rounded-md bg-gradient-to-br from-blue-700 to-purple-800">
                                        {selectedUser.name.slice(0, 1)}
                                    </h3>
                                    <h2 className="flex flex-col gap-1 text-2xl font-bold">
                                        {selectedUser.name}
                                        <small className="text-gray-500 font-normal text-sm">
                                            {selectedUser.email}
                                        </small>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-200 text-black font-medium px-3 py-[2px] capitalize rounded-2xl text-[14px] w-fit">
                                        {selectedUser.role}
                                    </span>
                                    <span className="bg-green-100 text-green-800 font-medium px-3 py-[2px] rounded-2xl text-[14px] w-fit">
                                        {
                                            Object.values(permission).filter(p => p === true).length + " "
                                        }
                                        ta ruhsat berilgan
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                {
                                    permissionsList
                                        .map((per) => (
                                            <div
                                                key={permission.key}
                                                className={`
                                                        h-[80px] flex justify-between items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all 
                                                        ${!permission[per.key]
                                                        ? "text-gray-400"
                                                        : "text-black"}
                                                    `}
                                            >
                                                <h4 className="text-lg font-medium">
                                                    {per.label}
                                                </h4>
                                                <div
                                                    title={permission[per.key] ? "O'chirish" : "Yoqish"}
                                                    className={`
                                                            flex items-center w-12 h-6 rounded-xl p-1 cursor-pointer transition-all 
                                                            ${!permission[per.key]
                                                            ? "justify-start bg-gray-200"
                                                            : "justify-end bg-green-400"} 
                                                        `}
                                                    onClick={() => setpermission({
                                                        ...permission,
                                                        [per.key]: !permission[per.key]
                                                    })}
                                                >
                                                    <div className="w-5 h-5 bg-white rounded-full" />
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                            <Button
                                className={`self-end bg-[#2121a9] hover:bg-blue-900 text-white px-6 py-2 rounded-lg`}
                                disabled={permission === selectedUser.permissions}
                                onClick={hanldeSavePermissions}>
                                Ruxsatlarni saqlash
                            </Button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Permissions