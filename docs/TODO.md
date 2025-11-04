# Slicer - Development TODO

## Tomorrow's Priority: Tools Panel

### Tool Ideas
- [ ] **Measurement Tools**
  - Distance measurement between points
  - Angle measurement
  - Bounding box dimensions display

- [ ] **Manipulation Tools**
  - Scale (uniform/non-uniform)
  - Rotate on X/Y/Z axis
  - Move/translate position

- [ ] **Analysis Tools**
  - Model volume calculator
  - Surface area calculator
  - Print time estimator
  - Material usage estimator

- [ ] **Editing Tools**
  - Mirror on X/Y/Z plane
  - Array/duplicate tool
  - Slice plane preview

- [ ] **View Tools**
  - Cross-section view
  - Wireframe toggle
  - Show/hide grid
  - Reset camera position

### UI Improvements
- [x] Add spacing between Model Gallery and History panel (margin-top: 20px)
- [ ] Consider adding a toolbar/ribbon for tools
- [ ] Tool state indicators
- [ ] Keyboard shortcuts for common tools

### Technical Notes
- Tools should work with loaded STL geometry
- Need to update stlExport.js to handle transformations
- Consider undo/redo stack for tool operations
- Add tooltips for tool usage

## Future Enhancements
- [ ] Multi-select models
- [ ] Save/load custom configurations
- [ ] Print settings presets
- [ ] Material library with properties
- [ ] Support for multi-material prints
