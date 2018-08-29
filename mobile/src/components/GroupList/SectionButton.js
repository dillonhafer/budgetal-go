class SectionButton extends Component {
  render() {
    return (
      <PrimaryButton
        disabled={options.length === 0}
        title={`ADD ${title}`}
        onPress={() => {
          this.props.screenProps.layoutNavigate('NewMonthItemScreen', {
            section,
            title,
            options,
          });
        }}
      />
    );
  }
}
