pub mod megadetector;
pub mod structures;
pub mod exports;
pub mod util;
pub mod opencv_yolov5;

#[cfg(test)]
mod tests {
    use super::opencv_yolov5::helpers::render_detections;
    use super::opencv_yolov5::YoloModel;

    #[test]
    fn create_model() {
        let image_path = "tests/fixtures/dataset/IMG_0089_peccary.JPG";

        let model = YoloModel::new_from_file(
            "../md_v5a.0.0-1280x1280.onnx",
            (1280, 1280),
        );
        assert!(model.is_ok());

        let mut model = model.unwrap();

        let detections = model.detect(image_path, 0.1, 0.45);

        assert!(detections.is_ok());

        let detections = detections.unwrap();

        assert_eq!(detections.detections.len(), 1);

        render_detections(image_path, &detections, "output.jpg").unwrap();
    }
}
