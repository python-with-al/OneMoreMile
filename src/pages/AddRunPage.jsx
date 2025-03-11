import RunEntryForm from '../components/RunTracking/RunEntryForm';

const AddRunPage = () => {
  const handleRunAdded = (newRun) => {
    // Update your app state or perform additional actions
    console.log('New run added:', newRun);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Run</h1>
      <RunEntryForm onRunAdded={handleRunAdded} />
    </div>
  );
};

export default AddRunPage;