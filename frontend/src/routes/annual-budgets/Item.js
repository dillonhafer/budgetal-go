const AnnualBudgetItem = ({ item, handleOnCardClick, handleOnDeleteClick }) => {
  const name = item.name;
  const loading = item.loading;
  const amount = currencyf(item.amount);
  const date = moment(item.dueDate).format('LL');
  const month = currencyf(round(item.amount / item.intervals));
  const color = item.paid ? '#87d068' : '#cacaca';
  const editItem = () => {
    const i = { ...item, dueDate: moment(item.dueDate) };
    handleOnCardClick(i);
  };

  const _d = async () => {
    const resp = await DeleteAnnualBudgetItemRequest(item);
    if (resp && resp.ok) {
      notice(`Deleted ${item.name}`);
      handleOnDeleteClick(item);
    }
  };

  const deleteItem = async () => {
    try {
      Modal.confirm({
        title: `Are you sure delete ${item.name}?`,
        content: 'This cannot be undone',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          _d();
        },
      });
    } catch (err) {
      //ignore for now
    }
  };

  const menu = getMenu({
    progress: _ => {},
    editItem,
    deleteItem,
  });

  return (
    <Col className="card" xs={24} sm={12} md={8} lg={8}>
      <Card
        loading={loading}
        noHovering
        title={name}
        extra={
          <div className="annual-item-crud">
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="ghost" shape="circle" icon="ellipsis" />
            </Dropdown>
          </div>
        }
      >
        <div className="text-center">
          <p>
            In order to reach <b>{amount}</b>
            <br />
            by <b>{date}</b>
            <br />
            you need to save
            <br />
            <b>{month}/month</b>
            <br />
          </p>
          <Tag color={color}>Paid</Tag>
        </div>

        {/*this.getProgressModal(item, this.state.showProgress)*/}
      </Card>
    </Col>
  );
};

export default AnnualBudgetItem;
