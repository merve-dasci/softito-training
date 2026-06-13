const Demo7EventHandling = () => {
    const butonaTiklandi = (mesaj) => {
        alert(mesaj);
    }
    const formGonder = (event) => {
        event.preventDefalut();
        alert("Form gönderildi, sayfa yenilemedi!");
    };
    return (
        <div className="p-4">
            <h3 className="text-xl font-bold">Demo 7: Olay Yönetimi</h3>
            <p className="mt-2 text-gray-600">React onClick ve onSubmit gibi olayları nasıl dinlediğimizi öğreniyoruz.</p>
            <div className="mt-4">
                <h4 className="font-bold"></h4>
                <div className="flex flex-col">
                    <button className="p-2 bg-blue-500" onClick={() => butonaTiklandi}>Tıkla - Mesaj Ver</button>
                    <button onClick={() => butonaTiklandi("Parametreli tıklama yapıldı!")} className="p-2 bg-green-500">Parametreli Tıklama</button>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="font-bold">Form Olayı (Submit)</h4>
                <form onSubmit={formGonder} className="p-4 border">
                    <input type="text" placeholder="Metin girin.." className="p-2 border" />
                    <button type="submit" className="p-2 bg-purple-500">Formu Gönder</button>
                </form>
            </div>
        </div>
    )
}

export default Demo7EventHandling;