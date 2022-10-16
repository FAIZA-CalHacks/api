const calculateInvestmentOutcome = (
  previousPostValue,
  currentPostValue,
  amount
) => {
  const investmentOutcome = (currentPostValue / previousPostValue) * amount
  return investmentOutcome
}

module.exports = calculateInvestmentOutcome
