import PropTypes from "prop-types";

export const appointmentDataShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDateTime: PropTypes.instanceOf(Date).isRequired,
  endDateTime: PropTypes.instanceOf(Date).isRequired,
  clientId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  additionalComments: PropTypes.string,
  totalPax: PropTypes.number,
  eventLocationType: PropTypes.string,
}).isRequired;

export const ToolTipHeaderPropTypes = {
  children: PropTypes.node,
  appointmentData: appointmentDataShape,
  onOpenButtonClick: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};
