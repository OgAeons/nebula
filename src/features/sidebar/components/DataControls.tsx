import { useAppStore } from '../../../store/useAppStore'

export const DataControls = () => {
  // Get all data and setters from the store
  const {
    numericColumns,
    categoricalColumns,
    selectedLabel,
    selectedFeatures,
    setSelectedLabel,
    setSelectedFeatures,
    rawNodes,
  } = useAppStore()

  // Handle when the user selects a new label
  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(e.target.value)
  }

  // Handle when the user selects features (for links)
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value)
    setSelectedFeatures(options)
  };

  // Don't show anything if no data is loaded
  if (rawNodes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-gray-700 pt-4 space-y-4">
      
      {/* --- Label/Color Selector --- */}
      <div>
        <label htmlFor="label-select" className="block text-sm font-medium mb-1">
          Select Label/Color Column
        </label>
        <select
          id="label-select"
          value={selectedLabel || ''}
          onChange={handleLabelChange}
          className="block w-full p-2 bg-gray-700 border-gray-600 rounded text-sm"
        >
          <option value="" disabled>-- Select a column --</option>
          {categoricalColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* --- Feature/Link Selector --- */}
      <div>
        <label htmlFor="features-select" className="block text-sm font-medium mb-1">
          Select Feature Columns (for links)
        </label>
        <p className="text-xs text-gray-400 mb-2">Hold Ctrl/Cmd to select multiple</p>
        <select
          id="features-select"
          multiple
          value={selectedFeatures}
          onChange={handleFeaturesChange}
          className="block w-full p-2 bg-gray-700 border-gray-600 rounded h-32 text-sm"
        >
          {numericColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};