
export const downloaddata = (canvasRef) => {
    if (!canvasRef) return

    const data = canvasRef.toDataURL({
        format: 'png',
        quality: 1.0
    })
    const link = document.createElement('a')
    link.download = `DrawBoard ${Date.now()}.png`
    link.href = data

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const convetSvg = (canvasref) => {
    if (!canvasref) return

    const svg = canvasref.toSVG()
    const blob = new Blob(
        [svg],
        {
            type: "image/svg+xml"
        }
    );

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download =  `DrawBoard ${Date.now()}.svg`
    link.href = url

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url);
}

export const convertjson = (canvasref)=>{
    if (!canvasref) return

    const data =  JSON.stringify(canvasref.toJSON())
    const blob = new Blob([data],{
        type:"application/json"
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download =  `DrawBoard ${Date.now()}.json`
    link.href = url

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url);


    
}