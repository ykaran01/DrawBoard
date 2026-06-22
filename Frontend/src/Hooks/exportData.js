
export const downloaddata = (canvasRef) => {
    if (!canvasRef) return

    const data = canvasRef.toDataURL({
        format: 'png',
        quality: 1.0
    })
    const link = document.createElement('a')
    link.download = `DrawBoard ${Date.now()}png`
    link.href = data

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}