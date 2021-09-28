// bold summary sentences 
function bold_summary_sentences(ex){
  $("#answer-sentences-table").addClass("d-none");
  $("#answer-paragraph-display").removeClass("d-none");
  $("#answer-paragraph").empty();
  $("#answer-paragraph").append('<p>');
  for (let i = 1; i<= ex['answer_sentences'].length; i++){
    if (ex['summary_sentences'].includes(i)){
      $("#answer-paragraph").append('<b>' + ex['answer_sentences'][i-1] + '</b>');
    }
    else{
      $("#answer-paragraph").append(ex['answer_sentences'][i-1]);
    }
  }
  $("#answer-paragraph").append('</p>');
}

// create sentence level table 
function create_sentence_level_table(ex){
  $("#answer-paragraph-display").addClass("d-none");
  $("#answer-sentences-table").removeClass("d-none");
  $("#answer-sentence-rows").empty();
  for (let i = 1; i<= ex['answer_sentences'].length; i++){
    if (ex['type'] == 'summary'){
      is_summary_count = ex['is_summary_count'][i-1];
      if (is_summary_count >= 2){
        $("#answer-sentence-rows").append(
          '<tr><th scope="row">' + + i + '</th><td>'
          +ex['answer_sentences'][i-1] + '</td><td>' + 'Answer (Summary)' + '</td></tr>');
      }
      else{
        $("#answer-sentence-rows").append(
                '<tr><th scope="row">' + i + '</th><td>'
                  +ex['answer_sentences'][i-1] + '</td><td>' + '' + '</td></tr>');
      }
    }
    // role
    else{
      if (ex['role_annotation'][i-1] != ''){
        $("#answer-sentence-rows").append(
          '<tr><th scope="row">' + + i + '</th><td>'
          +ex['answer_sentences'][i-1] + '</td><td>' + ex['role_annotation'][i-1] + '</td></tr>');
      }
      else {
      $("#answer-sentence-rows").append(
        '<tr><th scope="row">' + + i + '</th><td>'
        +ex['answer_sentences'][i-1] + '</td><td>' + ex['detail_role_annotation'][i-1] + '</td></tr>');
      }
    }
  }
}

function display_summary_sentences(ex){
  if (ex['type'] != 'role') {
    $("#summary-sentence-idx").text(ex["summary_sentences"].join(' , '));
  }
  else{
    // get all the summary index --> probably should move to the data processing side
    summary_index = [];
    for (let i = 1; i<= ex['role_annotation'].length; i++){
      if (ex['role_annotation'][i-1] == 'Answer (Summary)'){
        summary_index.push(i);
      }
    }
    $("#summary-sentence-idx").text(summary_index.join(' , '));
  }
}

function show_question_info(ex) {
  $("#question-display").removeClass("d-none");
  $("#question-info").text(ex["question"]);
  $("#dataset").text(ex["dataset"]);
  $("#type").text(ex["type"]);
  $("#batch_file").text(ex["batch_file"]);
  $("#answer-paragraph").text(ex["answer_paragraph"]);
  // valid question
  if (ex["type"] != "invalid") {
    $("#validity").text("Yes");
    $("#invalid-reason-display").addClass('d-none');
    $("#summary-display").removeClass("d-none");
    create_sentence_level_table(ex);
    display_summary_sentences(ex);
    // $("#nq-display").removeClass("d-none")
    // $("#nq-answer").text(ex["nq_answer"].join(' | '));
    // if (ex["is_temporal"]) {
    //   ex["temp_abs_labels"].map(label => {
    //     $("#temp-abs-labels").append(
    //       '<tr><th scope="row">' + label['date'] + '</th><td>' + label['answers'].join(' | ') + '</td></tr>');
    //   }); 
    //   ex["temp_rel_labels"].map(label => {
    //     $("#temp-rel-labels").append(
    //       '<tr><th scope="row">' + label['ctx'] + '</th><td>' + label['cur_or_prev'] + '</td><td>' + label['answer'].join(' | ') + '</td></tr>');
    //   });
    //   $("#ctx-display").text("Temporal");
    //   $("#geo-display").addClass("d-none");
    //   $("#temp-display").removeClass("d-none");
    // } else {
    //   ex["geo_labels"].map(label => {
    //     $("#geo-labels").append(
    //       '<tr><th scope="row">' + label['location'] + '</th><td>' + label['answers'].join(' | ') + '</td></tr>');
    //   });
    //   $("#ctx-display").text("Geographical");
    //   $("#temp-display").addClass("d-none");
    //   $("#geo-display").removeClass("d-none");
    // };
  } 
  // invalid questions
  else {
    // $("#nq-display").addClass("d-none")
    // $("#temp-display").addClass("d-none")
    // $("#geo-display").addClass("d-none");
    $("#validity").text("No");
    $("#summary-display").addClass('d-none');
    $("#invalid-reason-display").removeClass("d-none");
    $("#invalid-reason").text(ex['invalid_reason']);
    bold_summary_sentences(ex);
  };
};

function create_questions_list(data) {
  let dataset_filter = $("input[name=dataset_filter]:checked").val();
  let type_filter = $("input[name=type_filter]:checked").val();
  $("#questions-list").empty();
  Object.keys(data).map(ex => {
    if ((dataset_filter == "none"
         || (dataset_filter == "eli5" && data[ex]["dataset"] == "ELI5")
         || (dataset_filter == "nq" && data[ex]["dataset"] == "NQ"))
        && (type_filter == "none" || (type_filter == "summary" && data[ex]["type"] == "summary")
            || (type_filter == "invalid" && data[ex]["type"] == "invalid")
            || (type_filter == "role" && data[ex]["type"] == "role"))) {
    $("#questions-list").append('<button class="alert alert-info question-item text-start shadow container-fluid py-2 my-2" id=' + ex + 
    '>' + data[ex]['question'] +'</button>');
    }
  });
  $(".question-item").click(function() {
    $("#temp-rel-labels").empty();
    $("#temp-abs-labels").empty();
    $("#geo-labels").empty();
    show_question_info(data[$(this).attr('id')]);
    $("#question-display").removeClass("d-none");
  });
};

function shape_window() {
  $("body").css("overflow", "hidden");
  console.log($(window).height() - $("#navbar").outerHeight());
  // $("main").css("body", $(window).height());
  let navbar_height = $("#navbar").outerHeight();
  let filter_height = $("#filter-cell").outerHeight();
  $("#questions-list-cell").css("height", $(window).height() - navbar_height - filter_height);
  $("#question-display").css("height", $(window).height() - navbar_height);
};

$(document).ready(function() {
  shape_window();
  create_questions_list(data);
  $("input[name=dataset_filter]").click(function() { create_questions_list(data) });
  $("input[name=type_filter]").click(function() { create_questions_list(data) });
});
