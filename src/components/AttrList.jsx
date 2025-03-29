const AttrList = ({ attrs, remainingQs }) => {
    return (
        <div className="flex flex-col w-full h-full bg-gray-50 border-gray-200 border-2 p-2 shadow-md">
            <p>Questions left: {remainingQs}</p>
            
            <div className="overflow-y-auto">
            {
                attrs.map((element, index) => (
                    <>
                        <p className="break-all animate-fade-in" key={index}>{element.slice(0, -1)}</p>
                        <p 
                            className={
                                "animate-fade-in text-center text-xl " + (
                                    element.slice(-1) === "Y" ? "text-green-500" : (element.slice(-1) === "N" ? "text-red-500" : "text-gray-500")
                                )
                            } 
                            key={-index}
                        >
                                {element.slice(-1)}
                        </p>
                        <hr />
                    </>
                ))
            }
            </div>
        </div>
    );
};

export default AttrList;