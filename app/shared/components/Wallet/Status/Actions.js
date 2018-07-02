// @flow
import React, { Component } from 'react';
import { Header, Grid, Loader, Segment, Visibility } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import ActionsTable from './Actions/Table';

type Props = {
  actionHistory: {},
  actions: {
    getAccountActions: () => void
  },
  settings: {},
  t: () => void,
  validate: {}
};

class Actions extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      amount: 20
    };
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadMore = () => this.setState({ amount: this.state.amount + 20 }, () => {
    const {
      actionHistory,
      actions,
      settings
    } = this.props;

    if (!this.reachedEndOfActions() && actionHistory.list.length < this.state.amount) {
      const {
        getActions
      } = actions;

      const relevantActionsCached = actionHistory.list.filter((action) => {
        return (actionHistory.last_loaded_request_id...actionHistory.last_loaded_request_id - 19).include(action.request_id)
      })

      // Check if all of the needed items are already in the store, if so skip the API call.

      if (relevantActionsCached !== 20) {
        getActions(settings.account, actionHistory.oldest_request_id, -20);
      }
    }
  });

  reachedEndOfActions() {
    const {
      actionHistory
    } = this.props;

    return actionHistory.oldest_request_id === 1;
  }

  tick() {
    const {
      actions,
      settings
    } = this.props;

    const {
      getActions
    } = actions;

    getActions(settings.account, -1, -20);
  }

  render() {
    const {
      actionHistory,
      settings,
      t,
    } = this.props;

    const {
      amount
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Grid.Column width={10}>
          {(actionHistory.list.length > 0)
           ? [(
             <Visibility
               continuous
               key="ActionsTable"
               fireOnMount
               onBottomVisible={this.loadMore}
               once={false}
             >
               <ActionsTable
                 amount={amount}
                 actionHistory={actionHistory}
                 attached="top"
                 settings={settings}
               />
             </Visibility>
           ), (
             (amount > actionHistory.list.length && !this.reachedEndOfActions())
             ? (
               <Segment key="ActionsTableLoading" clearing padded vertical>
                 <Loader active />
               </Segment>
             ) : false
           )]
           : (
             <Segment attached="bottom" stacked>
               <Header textAlign="center">
                 {t('actions_table_none')}
               </Header>
             </Segment>
           )
          }
        </Grid.Column>
      </div>
    );
  }
}

export default translate('actions')(Actions);
