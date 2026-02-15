const Results = ({ results = [] }) => {
  // ✅ Calculate total votes safely
  const totalVotes = results.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="space-y-4">
      {results.map((item, index) => {
        const percent = totalVotes
          ? Math.round((item.votes / totalVotes) * 100)
          : 0;

        return (
          <div key={index} className="space-y-1">
            {/* Option + Percentage */}
            <div className="flex justify-between text-sm font-medium">
              <span>{item.option}</span>
              <span>{percent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Vote Count */}
            <p className="text-xs text-gray-500">{item.votes} votes</p>
          </div>
        );
      })}

      {/* Total Votes */}
      <div className="pt-4 border-t text-sm text-gray-600">
        Total votes: <span className="font-semibold">{totalVotes}</span>
      </div>
    </div>
  );
};

export default Results;
