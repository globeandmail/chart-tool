function hasItselfAsExport(parent, fname) {
  it('has ' + fname + ' as an export', function() {
    expect(parent[fname]).not.toBeNull();
  });
}

module.exports = hasItselfAsExport;
