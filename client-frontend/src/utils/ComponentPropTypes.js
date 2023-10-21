import PropTypes from "prop-types";

export const appointmentDataShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  clientId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  additionalComments: PropTypes.string,
  totalPax: PropTypes.number,
}).isRequired;

export const ToolTipHeaderPropTypes = {
  children: PropTypes.node,
  appointmentData: appointmentDataShape,
  onOpenButtonClick: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

