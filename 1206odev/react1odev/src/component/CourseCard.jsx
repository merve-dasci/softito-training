const CourseCard = ({courseName, instructor="Merve Daşçi", studentCount, isActive, onRegister,}) => {
    return (
        <div className="bg-white border border-pink-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-pink-700">{courseName}</h3>
            <p className="mt-2">Eğitmen: {instructor}</p>
            <p>Öğrenci Sayısı: {studentCount}</p>
            <div className="mt-3">
                {isActive ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Aktif Kurs</span>
                ) : (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm ">Pasif Kurs</span>
                )}
            </div>
            <button  onClick={onRegister} disabled={!isActive} className={`mt-4 px-4 py-2 rounded-lg text-sm text-white
            ${
                isActive ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-300 cursor-not-allowed"
            }`}>{isActive ? "Kursa Kayıt Ol" : "Kayıt Kapalı"}</button>
        </div>

    )
}
export default CourseCard;