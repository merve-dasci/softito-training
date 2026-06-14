import CourseCard from "./component/CourseCard";
import Header from "./component/Header";
import { useState } from "react";
import PanelCard from "./component/PanelCard";
import Footer from "./component/Footer";

function App() {
  
  const dersAdi = "React ve JSX Temelleri";
  const ogrenciSayisi = 24;
  const aktifMi = true;
  const yil = 2026;

  const [kayitSayisi, setKayitSayisi] = useState(ogrenciSayisi);
  const maxKontenjan = 30;

  const courses = [
    {
      id: 1,
      courseName: "React Eğitimi",
      instructor: "Merve Daşçi",
      studentCount: 24,
      isActive: true,
    },
    {
      id: 2,
      courseName: "JavaScript Eğitimi",
      instructor: "Merve Daşçi",
      studentCount: 24,
      isActive: true,
    },
    {
      id: 3,
      courseName: "Tailwind CSS Eğitimi",
      instructor: "Merve Daşçi",
      studentCount: 32,
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-pink-50 p-6 text-stone-700">
      <div className="max-w-5xl mx-auto bg-[#fffaf7] shadow p-6 border border-pink-100">
        <Header />
        <div className="mt-6">
          <PanelCard>
          <h2 className="text-xl font-bold text-stone-700">Kurs Bilgileri</h2>
          <p className="mt-2">
            <strong>Ders Adı: </strong>
            {dersAdi}
          </p>
          <p>
            <strong>Öğrenci Sayısı: </strong>
            {kayitSayisi}
          </p>
          <p>
            <strong>Ders Yılı: </strong>
            {yil}
          </p>
          <p>
            <strong>Kontenjan Sonrası Toplam: </strong>
            {ogrenciSayisi + 6}
          </p>
          <p>
            <strong>Ders Adı Büyük Harf: </strong>
            {dersAdi.toUpperCase()}
          </p>
          <p>
            <strong>Ders Durumu: </strong>
            {aktifMi ? "Aktif" : "Pasif"}
          </p>
         
          <div className="mt-3">
            {kayitSayisi <maxKontenjan ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Kayıt Alınıyor</span> ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Kontenjan Doldu</span>
              
            )}
          </div>
          </PanelCard>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Kurslarımız</h2>
          <div className="grid md:grid-cols-3 gap-4">
       {courses.map((course) => (
        <CourseCard key={course.id} courseName={course.courseName} instructor={course.instructor} studentCount={course.studentCount} isActive={course.isActive} onRegister={() => {
          if(kayitSayisi <maxKontenjan) {
            setKayitSayisi(kayitSayisi +1);
          }
        }} />
       ))}
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}
export default App;