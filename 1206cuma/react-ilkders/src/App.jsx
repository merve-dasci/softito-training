import Demo1JSXBasic from "./component/Demo1JSXBasic";
import { useState } from "react";
import Demo2Component from "./component/Demo2Component";
import Demo3PropsBasic from "./component/Demo3PropsBasic";
import Demo4PropsChildren from "./component/Demo4PropsChildren";
import Demo5ConditionalRendering from "./component/Demo5ConditionalRendering";
import Demo6ListRendering from "./component/Demo6ListRendering";
import Demo7EventHandling from "./component/Demo7EventHandling";
import Demo8ReadonlyProps from "./component/Demo8ReadonlyProps";
import Demo9DefaultProps from "./component/Demo9DefaultProps";
import Demo10Composition from "./component/Demo10Composition";


function App() {
  const [selectedDemo, setSelectedDemo] = useState(1);

  const renderDemo = () => {
    switch (selectedDemo) {
      case 1:
        return <Demo1JSXBasic />;
      case 2:
        return <Demo2Component />;
      case 3:
        return <Demo3PropsBasic />;
      case 4:
          return <Demo4PropsChildren />;
      case 5:
        return <Demo5ConditionalRendering />
      case 6:
        return <Demo6ListRendering />;
      case 7: 
      return <Demo7EventHandling />;
      case 8: 
      return <Demo8ReadonlyProps />
      case 9:
        return <Demo9DefaultProps />
      case 10:
        return <Demo10Composition />
        default:
          return <Demo1JSXBasic />;
    }
  };

  const demolar = [
    { id: 1, ad: "Demo 1: Temel JSX" },
    { id: 2, ad: "Demo 2: Bileşenler" },
    { id: 3, ad: "Demo 3: Props" },
    { id: 4, ad: "Demo 4: Props Children" },
    { id: 5, ad: "Demo 5: Koşullu Render" },
    { id: 6, ad: "Demo 6: Listeleme Render" },
    { id: 7, ad: "Demo 7: Olay Yönetimi" },
    { id: 8, ad: "Demo 8: Salt Okunur" },
    { id: 9, ad: "Demo 9: Varsayılan Prop" },
    {id: 10, ad: "Demo 10: E-Ticaret Sepeti"},
  ];
  return (
    <div className="p-4">
      <div className="border">
        <div className="p-4 bg-orange-600">
          <h1 className="text-white text-xl">React ve Props Paneli</h1>
        </div>
        <div className="grid grid-cols-4">
          <div className="border-r">
            <div className="sidebar-list">
              {demolar.map((demo) => (
                <button key={demo.id} onClick={() => setSelectedDemo(demo.id)} className={selectedDemo === demo.id ? "bg-blue-500 text-white" : "bg-gray-100"}>{demo.ad}</button>
              ))}
            </div>
          </div>
          <div className="col-span-3">
            <div className="p-4">{renderDemo()}</div>
          </div>
        </div>
      
      </div>
    </div>
  );
}
export default App;