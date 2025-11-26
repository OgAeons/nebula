import { useAppStore } from "../../../store/useAppStore"
import { type ChangeEvent } from "react"
import { analyzeData } from "../../../utils/analyzeData"

export const FileUpload = () => {
    const setAnalyzedData = useAppStore((state) => state.setAnalyzedData)
    const isLoading = useAppStore((state) => state.isLoading)
    const setIsLoading = (loading: boolean) => useAppStore.setState({isLoading: loading})


    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if(!file) return

        setIsLoading(true)

        try {
            const result = await analyzeData(file)
            setAnalyzedData(result)
        } catch(err) {
            console.error("CSV processing error: " + err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="file-upload">
            <label htmlFor="file-input" className="block text-sm font-medium mb-1">
                Upload Data (CSV)
            </label>
            <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange} 
                disabled={isLoading}
                autoComplete="off"
                className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm 
                file:font-semibold file:bg-blue-600 file:text-white
                hover:file:bg-blue-700"
            />
            {isLoading && <p className="text-sm mt-2">Loading...</p>}
        </div>
    )
}