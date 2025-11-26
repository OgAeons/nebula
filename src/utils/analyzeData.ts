import Papa from "papaparse"

export interface AnalyzedData {
    rawNodes: any[]
    allColumns: string[]
    numericColumns: string[]
    categoricalColumns: string[]
    defaultLabel: string | null;
}

function analyzeColumns(data: any[], fields: string[]) {
    if (data.length === 0) {
        return { numeric: [], categorical: [] }
    }
    
    const numeric: string[] = []
    const categorical: string[] = []
    const firstRow = data[0]

    fields.forEach(col => {
        const value = firstRow[col]

        if(typeof value === 'number' && isFinite(value)) {
            numeric.push(col)
        } else {
            categorical.push(col)
        }
    })

    return { numeric, categorical }
}

export const analyzeData = (file: File): Promise<AnalyzedData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result

            if(typeof result !== 'string' || result.length === 0) {
                return reject(new Error("File is empty or could not be read"))
            }

            Papa.parse(result, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data as any[]
                    const ogColumns = results.meta.fields || []

                    // add unique ids
                    const idData = parsedData.map((row, index) => ({
                        ...row,
                        id: `node-${index}`
                    }))

                    // analyze columns
                    const { numeric, categorical } = analyzeColumns(idData, ogColumns)

                    // set default label
                    const lowerCats = categorical.map(c => c.toLowerCase())
                    let defaultLabel = categorical[0]
                    
                    if (lowerCats.includes('name')) defaultLabel = categorical[lowerCats.indexOf('name')]
                    else if (lowerCats.includes('label')) defaultLabel = categorical[lowerCats.indexOf('label')]
                    else if (lowerCats.includes('title')) defaultLabel = categorical[lowerCats.indexOf('title')]

                    // resolve promise wiht data
                    resolve({
                        rawNodes: idData,
                        allColumns: ogColumns,
                        numericColumns: numeric,
                        categoricalColumns: categorical,
                        defaultLabel: defaultLabel
                    })
                },
                error: (error: any) => { 
                    reject(error);
                }
            })
        }

        reader.onerror = (event: ProgressEvent<FileReader>) => {
            reject(event.target?.error);
        }

        reader.readAsText(file)
    })
}