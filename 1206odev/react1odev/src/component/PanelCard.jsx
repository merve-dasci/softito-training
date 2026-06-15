const PanelCard =(props) => {
    return(
        <div className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm">{props.children}</div>
    )
}
export default PanelCard;