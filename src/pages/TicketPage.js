/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTheme, withStyles } from '@material-ui/core/styles';
import {
  formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from '@openimis/fe-core';
import TicketForm from '../components/TicketForm';
import { updateTicket, createTicket } from '../actions';
import { RIGHT_TICKET_ADD, RIGHT_TICKET_EDIT, TICKET_STATUSES } from '../constants';

const styles = (theme) => ({
  page: theme.page,
  lockedPage: theme.page.locked,
});

class TicketPage extends Component {
  add = () => {
    historyPush(this.props.modulesManager, this.props.history, 'grievance.route.ticket');
  };

  save = (ticket) => {
    if (!ticket.id) {
      this.props.createTicket(
        this.props.modulesManager,
        ticket,
        formatMessageWithValues(
          this.props.intl,
          'ticket',
          'createTicket.mutationLabel',
          { label: ticket.code ? ticket.code : '' },
        ),
      );
    } else {
      this.props.updateTicket(
        this.props.modulesManager,
        ticket,
        formatMessageWithValues(
          this.props.intl,
          'ticket',
          'updateTicket.mutationLabel',
          { label: ticket.code ? ticket.code : '' },
        ),
      );
    }
  };

  render() {
    const {
      classes, modulesManager, history, rights, ticketUuid, overview, ticket, ticketVersion,
    } = this.props;
    const readOnly = ticket?.status === TICKET_STATUSES.CLOSED || ticket?.isHistory;
    if (!(rights.includes(RIGHT_TICKET_EDIT) || rights.includes(RIGHT_TICKET_ADD))) return null;
    return (
      <div className={`${readOnly ? classes.lockedPage : null} ${classes.page}`}>
        <TicketForm
          overview={overview}
          ticketUuid={ticketUuid}
          ticketVersion={ticketVersion}
          readOnly={readOnly}
          back={() => historyPush(modulesManager, history, 'grievanceSocialProtection.route.tickets')}
          add={rights.includes(RIGHT_TICKET_ADD) ? this.add : null}
          save={rights.includes(RIGHT_TICKET_EDIT) ? this.save : null}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  ticketUuid: props.match.params.ticket_uuid,
  ticketVersion: props.match.params.version,
  ticket: state.grievanceSocialProtection.ticket,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ createTicket, updateTicket }, dispatch);

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(withTheme(withStyles(styles)(TicketPage))),
)));
